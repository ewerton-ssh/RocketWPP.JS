import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const RedirectTimeout = ({ to, timeout }) => {
  const history = useHistory();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      history.push(to);
    }, timeout);

    return () => clearTimeout(redirectTimer);
  }, [history, to, timeout]);

  return null;
};

export default RedirectTimeout;