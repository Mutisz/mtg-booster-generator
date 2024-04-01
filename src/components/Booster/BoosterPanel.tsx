import Container from 'react-bootstrap/Container';

import { useBoosterList } from '../../hooks/useBoosterList';
import BoosterCardRow from './BoosterCardRow';

const BoosterPanel: React.FC = () => {
  const { boosterList } = useBoosterList();
  let key = 1;

  return (
    <>
      {boosterList.map((booster) => (
        <Container key={key++} className="mb-4">
          <h3>Booster {key}</h3>
          <hr />
          <BoosterCardRow booster={booster} />
        </Container>
      ))}
    </>
  );
};

export default BoosterPanel;
