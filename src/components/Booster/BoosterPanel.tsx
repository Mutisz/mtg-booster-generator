import Container from 'react-bootstrap/Container';

import { useCardBoosterList } from '../../hooks/useCardBoosterList';
import BoosterCardRow from './BoosterCardRow';

const BoosterPanel: React.FC = () => {
  const { cardBoosterList } = useCardBoosterList();
  let key = 1;

  return (
    <>
      {cardBoosterList.map((booster) => (
        <Container key={key++} className="mb-4">
          <h3>Booster {key}</h3>
          <BoosterCardRow booster={booster} />
        </Container>
      ))}
    </>
  );
};

export default BoosterPanel;
