import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import { BoosterCard } from '../../state';

const BoosterCardCol: React.FC<{ card: BoosterCard }> = ({ card }) => {
  const imgUrlList = card.imgUrlList ?? [];

  return (
    <Col>
      <Card style={{ width: '12rem', minHeight: '24rem' }}>
        {imgUrlList.map((url) => (
          <Card.Img key={url} variant="top" src={url} alt={card.cardName} />
        ))}
        <Card.Body>
          <Card.Title>{card.cardName}</Card.Title>
          {card.dataUrl ? (
            <Card.Text>
              <a href={card.dataUrl} target="_blank">
                Show on Gatherer
              </a>
            </Card.Text>
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BoosterCardCol;
