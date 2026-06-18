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
      <p className="lead">不同身份會看到不同的活動內容，請選擇這次參與的方式。</p>
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
          onClick={() => { setSelectedRole('member'); setError(''); setPassword(''); }}
        >
          <span>02</span>
          <strong>隊員</strong>
        </button>
      </div>
      {selectedRole === 'leader' && (
        <div className="password-panel">
          <label htmlFor="leader-password">小隊長通關密碼</label>
          <input
            id="leader-password"
            type="password"
            autoComplete="off"
            value={password}
            placeholder="請輸入通關密碼"
            onChange={(event) => { setPassword(event.target.value); setError(''); }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') continueActivity();
            }}
          />
        </div>
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
      <BottomActions>
        <button className="button button-primary" onClick={continueActivity}>
          確認身份 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}
