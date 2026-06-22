import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomActions, Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';

const LEADER_PASSWORD = 'victor2026';

export function IdentityPage() {
  const navigate = useNavigate();
  const { progress, setRole } = useActivityProgress();
  const [selectedRole, setSelectedRole] = useState<'leader' | 'member' | null>(progress.role);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const continueActivity = () => {
    if (!selectedRole) {
      setError('請先選擇你的身份。');
      return;
    }
    if (selectedRole === 'leader' && password !== LEADER_PASSWORD) {
      setError('通關密碼不正確。');
      return;
    }
    setRole(selectedRole);
    navigate('/instructions');
  };

  return (
    <Layout eyebrow="IDENTITY · 身份確認">
      <h1 className="display-title">你是誰？</h1>
      <p className="lead">不同身份會看到對應的內容，請選擇這次參與的方式：</p>
      <div className="role-options">
        <button
          className={`role-card ${selectedRole === 'leader' ? 'selected' : ''}`}
          onClick={() => { setSelectedRole('leader'); setError(''); }}
        >
          <span>01</span>
          <strong>小隊長</strong>
        </button>
        <button
          className={`role-card ${selectedRole === 'member' ? 'selected' : ''}`}
          onClick={() => { setSelectedRole('member'); setError(''); setPassword(''); setShowPassword(false); }}
        >
          <span>02</span>
          <strong>隊員</strong>
        </button>
      </div>
      {selectedRole === 'leader' && (
        <div className="password-panel">
          <label htmlFor="leader-password">小隊長通關密碼</label>
          <div className="password-input-wrap">
            <input
              id="leader-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              value={password}
              placeholder="請輸入通關密碼"
              onChange={(event) => { setPassword(event.target.value); setError(''); }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') continueActivity();
              }}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.9 10.9 0 0112 4c5.5 0 9 5 9 5a16.8 16.8 0 01-2.5 2.9M6.2 6.3C4.2 7.7 3 9 3 9s3.5 5 9 5c1.1 0 2.1-.2 3-.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
      <BottomActions>
        <button className="button button-ghost" onClick={() => navigate('/story')}>
          閱讀日記
        </button>
        <button className="button button-primary" onClick={continueActivity}>
          確認身份 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}
