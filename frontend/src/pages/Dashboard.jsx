import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import HomeHero from '../components/homepageComponent';
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div >
     
      <HomeHero />
    </div>
  );
}
