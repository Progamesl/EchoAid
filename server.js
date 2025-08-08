const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize OpenAI
let openai = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI API configured successfully');
  } else {
    console.log('⚠️  OpenAI API key not configured - using fallback responses');
  }
} catch (error) {
  console.log('⚠️  OpenAI initialization failed - using fallback responses');
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// In-memory storage (replace with real database in production)
let users = [];
let sessions = [];
let crisisInterventions = [];
let analytics = {
  totalUsers: 0,
  totalSessions: 0,
  totalCrisisInterventions: 0,
  averageSessionDuration: 0,
  mostCommonIssues: [],
  successRate: 0
};

// Crisis detection patterns
const crisisPatterns = {
  suicide: {
    keywords: ['kill myself', 'end it all', 'want to die', 'suicide', 'end my life', 'no reason to live'],
    severity: 10,
    immediateActions: [
      'Call 988 - National Suicide Prevention Lifeline',
      'Text HOME to 741741 - Crisis Text Line',
      'Call 911 if in immediate danger',
      'Remove access to lethal means',
      'Stay with the person if possible'
    ]
  },
  selfHarm: {
    keywords: ['hurt myself', 'cut myself', 'self harm', 'self-injury', 'bleeding'],
    severity: 8,
    immediateActions: [
      'Assess for immediate medical attention',
      'Remove access to sharp objects',
      'Call crisis hotline',
      'Seek professional help immediately'
    ]
  },
  hopelessness: {
    keywords: ['hopeless', 'no future', 'nothing matters', 'pointless', 'worthless'],
    severity: 6,
    immediateActions: [
      'Practice grounding techniques',
      'Contact mental health professional',
      'Reach out to trusted person',
      'Focus on small, manageable tasks'
    ]
  }
};

// AI Response Generation
async function generateAIResponse(userMessage, context = {}) {
  try {
    // If OpenAI is not available, use fallback responses
    if (!openai) {
      const fallbackResponses = [
        "I'm here to support you. Can you tell me more about what you're experiencing?",
        "Thank you for sharing that with me. I can hear that you're going through a challenging time, and it takes courage to open up about these feelings.",
        "I understand this is difficult. Let's work through this together, one step at a time.",
        "Your feelings are valid, and I'm here to listen. What would be most helpful for you right now?",
        "It sounds like you're dealing with a lot. Remember, healing isn't linear, and it's okay to have difficult moments."
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return randomResponse;
    }

    const systemPrompt = `You are EchoAid, an AI mental health coach designed to provide compassionate, evidence-based support. Your role is to:

1. Listen actively and validate feelings
2. Provide evidence-based therapeutic techniques
3. Detect crisis situations and respond appropriately
4. Offer practical coping strategies
5. Encourage professional help when needed
6. Maintain a warm, supportive tone

Current context: ${JSON.stringify(context)}

Remember:
- Always prioritize safety in crisis situations
- Provide specific, actionable advice
- Use therapeutic techniques like CBT, DBT, mindfulness
- Encourage professional help when appropriate
- Be empathetic but not overly emotional
- Keep responses concise but comprehensive`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I'm here to support you. Can you tell me more about what you're experiencing?";
  }
}

// Crisis Detection
function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  let crisisLevel = 0;
  const detectedIssues = [];

  Object.entries(crisisPatterns).forEach(([issue, pattern]) => {
    pattern.keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        crisisLevel += pattern.severity;
        detectedIssues.push({
          type: issue,
          severity: pattern.severity,
          immediateActions: pattern.immediateActions
        });
      }
    });
  });

  return {
    crisisDetected: crisisLevel >= 5,
    crisisLevel,
    detectedIssues,
    requiresImmediateAction: crisisLevel >= 8
  };
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Validate input
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      displayName,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      preferences: {
        language: 'en',
        theme: 'dark',
        notifications: true
      },
      stats: {
        totalSessions: 0,
        totalMessages: 0,
        crisisInterventions: 0,
        wellnessScore: 75,
        streak: 0,
        level: 1,
        xp: 0
      }
    };

    users.push(newUser);

    // Generate JWT
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        preferences: newUser.preferences,
        stats: newUser.stats
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        preferences: user.preferences,
        stats: user.stats
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Chat endpoint
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Detect crisis
    const crisisAnalysis = detectCrisis(message);
    
    // Generate AI response
    const context = {
      userId,
      sessionId,
      crisisDetected: crisisAnalysis.crisisDetected,
      crisisLevel: crisisAnalysis.crisisLevel,
      userHistory: sessions.filter(s => s.userId === userId).slice(-5)
    };

    const aiResponse = await generateAIResponse(message, context);

    // Create session if doesn't exist
    let session = sessions.find(s => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId || `session_${Date.now()}`,
        userId,
        startTime: new Date().toISOString(),
        messages: [],
        crisisDetected: false,
        crisisData: null,
        moodTrend: [],
        sessionType: 'general',
        techniques: [],
        insights: [],
        recommendations: []
      };
      sessions.push(session);
    }

    // Add messages to session
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    const aiMessage = {
      id: `msg_${Date.now()}_ai`,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      crisisDetected: crisisAnalysis.crisisDetected,
      crisisLevel: crisisAnalysis.crisisLevel
    };

    session.messages.push(userMessage, aiMessage);
    session.crisisDetected = session.crisisDetected || crisisAnalysis.crisisDetected;

    // Update user stats
    const user = users.find(u => u.id === userId);
    if (user) {
      user.stats.totalMessages += 2;
      if (crisisAnalysis.crisisDetected) {
        user.stats.crisisInterventions += 1;
        crisisInterventions.push({
          userId,
          sessionId: session.id,
          timestamp: new Date().toISOString(),
          crisisLevel: crisisAnalysis.crisisLevel,
          detectedIssues: crisisAnalysis.detectedIssues
        });
      }
    }

    // Update analytics
    analytics.totalSessions = sessions.length;
    analytics.totalCrisisInterventions = crisisInterventions.length;

    res.json({
      message: 'Chat response generated',
      response: aiResponse,
      crisisAnalysis,
      session: {
        id: session.id,
        crisisDetected: session.crisisDetected,
        messageCount: session.messages.length
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Get user sessions
app.get('/api/sessions', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userSessions = sessions.filter(s => s.userId === userId);
    
    res.json({
      sessions: userSessions.map(session => ({
        id: session.id,
        startTime: session.startTime,
        messageCount: session.messages.length,
        crisisDetected: session.crisisDetected,
        sessionType: session.sessionType
      }))
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

// Get session details
app.get('/api/sessions/:sessionId', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;
    
    const session = sessions.find(s => s.id === sessionId && s.userId === userId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Update user preferences
app.put('/api/user/preferences', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferences } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.preferences = { ...user.preferences, ...preferences };

    res.json({
      message: 'Preferences updated',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get analytics
app.get('/api/analytics', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userSessions = sessions.filter(s => s.userId === userId);
    const userCrisisInterventions = crisisInterventions.filter(c => c.userId === userId);

    const userAnalytics = {
      totalSessions: userSessions.length,
      totalMessages: userSessions.reduce((sum, s) => sum + s.messages.length, 0),
      crisisInterventions: userCrisisInterventions.length,
      averageSessionDuration: userSessions.length > 0 ? 
        userSessions.reduce((sum, s) => sum + s.messages.length, 0) / userSessions.length : 0,
      mostCommonIssues: userCrisisInterventions.map(c => c.detectedIssues).flat(),
      successRate: userSessions.length > 0 ? 
        (userSessions.filter(s => !s.crisisDetected).length / userSessions.length) * 100 : 0
    };

    res.json({
      global: analytics,
      user: userAnalytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// Crisis intervention endpoint
app.post('/api/crisis/intervention', authenticateToken, (req, res) => {
  try {
    const { sessionId, crisisData, actionTaken } = req.body;
    const userId = req.user.userId;

    const intervention = {
      id: `intervention_${Date.now()}`,
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      crisisData,
      actionTaken,
      resolved: false
    };

    crisisInterventions.push(intervention);

    res.json({
      message: 'Crisis intervention recorded',
      intervention
    });
  } catch (error) {
    console.error('Crisis intervention error:', error);
    res.status(500).json({ error: 'Failed to record intervention' });
  }
});

// Crisis detection (direct endpoint for frontend demos)
app.post('/api/crisis/detect', (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    const analysis = detectCrisis(message);

    const response = {
      ...analysis,
      recommendedActions: analysis.requiresImmediateAction
        ? [
            'Call 988 - National Suicide & Crisis Lifeline',
            'Text HOME to 741741 - Crisis Text Line',
            'Call 911 if there is immediate danger'
          ]
        : ['Practice grounding techniques', 'Reach out to a trusted person', 'Schedule time with a professional'],
      directHelp:
        analysis.requiresImmediateAction
          ? {
              call988: 'tel:988',
              textCrisis: 'sms:741741',
              call911: 'tel:911',
              liveChat: 'https://988lifeline.org/chat'
            }
          : {},
    };

    res.json(response);
  } catch (error) {
    console.error('Crisis detect error:', error);
    res.status(500).json({ error: 'Failed to analyze message' });
  }
});

// Seed demo data (in-memory) for quick demos
app.post('/api/demo/seed', (req, res) => {
  try {
    // Seed users
    users = [
      {
        id: 'user_demo',
        email: 'demo@echoaid.app',
        displayName: 'Demo User',
        password: '$2a$10$abcdefghijklmnopqrstuv', // fake hash placeholder
        createdAt: new Date().toISOString(),
        preferences: { language: 'en', theme: 'dark', notifications: true },
        stats: { totalSessions: 3, totalMessages: 18, crisisInterventions: 1, wellnessScore: 82, streak: 3, level: 2, xp: 120 }
      }
    ];

    // Seed sessions
    sessions = [
      {
        id: 'session_1',
        userId: 'user_demo',
        startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        messages: [
          { id: 'm1', type: 'user', content: 'I felt anxious this morning', timestamp: new Date().toISOString() },
          { id: 'm2', type: 'ai', content: 'Thanks for sharing. Let’s try a grounding exercise together.', timestamp: new Date().toISOString() }
        ],
        crisisDetected: false,
        crisisData: null,
        moodTrend: [0.4, 0.5, 0.6],
        sessionType: 'general',
        techniques: ['breathing', 'journaling'],
        insights: ['Morning anxiety pattern'],
        recommendations: ['Try 5-4-3-2-1 technique']
      },
      {
        id: 'session_2',
        userId: 'user_demo',
        startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        messages: [],
        crisisDetected: true,
        crisisData: { crisisLevel: 8 },
        moodTrend: [0.2, 0.3, 0.5],
        sessionType: 'crisis',
        techniques: ['safety-planning'],
        insights: ['High-risk language detected'],
        recommendations: []
      }
    ];

    // Seed crisis interventions
    crisisInterventions = [
      {
        userId: 'user_demo',
        sessionId: 'session_2',
        timestamp: new Date().toISOString(),
        crisisLevel: 8,
        detectedIssues: [{ type: 'suicide', severity: 10, immediateActions: crisisPatterns.suicide.immediateActions }]
      }
    ];

    // Seed global analytics
    analytics = {
      totalUsers: 1,
      totalSessions: sessions.length,
      totalCrisisInterventions: crisisInterventions.length,
      averageSessionDuration: 7,
      mostCommonIssues: ['anxiety', 'hopelessness'],
      successRate: 88
    };

    res.json({ message: 'Demo data seeded', users: users.length, sessions: sessions.length, interventions: crisisInterventions.length });
  } catch (error) {
    console.error('Demo seed error:', error);
    res.status(500).json({ error: 'Failed to seed demo data' });
  }
});

// Export session data
app.get('/api/sessions/:sessionId/export', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;
    
    const session = sessions.find(s => s.id === sessionId && s.userId === userId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const user = users.find(u => u.id === userId);
    const exportData = {
      session,
      user: {
        id: user.id,
        displayName: user.displayName,
        preferences: user.preferences,
        stats: user.stats
      },
      exportDate: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="echoaid-session-${sessionId}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Export session error:', error);
    res.status(500).json({ error: 'Failed to export session' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EchoAid Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Authentication endpoints available`);
  console.log(`🤖 AI Chat endpoint available`);
  console.log(`📈 Analytics endpoints available`);
});

module.exports = app; 