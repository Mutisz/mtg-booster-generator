import Row from 'react-bootstrap/Row';

import { Booster } from '../../state';
import BoosterCardCol from './BoosterCardCol';

const BoosterCardRow: React.FC<{ booster: Booster }> = ({ booster }) => {
  const { cardList } = booster;
  let key = 1;

  return (
    <Row className="gx-2 gy-2">
      {cardList.map((card) => (
        <BoosterCardCol key={key++} card={card} />
      ))}
    </Row>
  );
};

export default BoosterCardRow;
