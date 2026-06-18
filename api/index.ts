import express from 'express';

const app = express();
app.disable('x-powered-by');

app.get(['/api/health', '/api', '/health', '/'], (_request, response) => {
  response.json({ success: true });
});

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: '找不到這個 API。' },
  });
});

export default app;
