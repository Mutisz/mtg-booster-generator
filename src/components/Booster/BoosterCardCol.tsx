import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import { BoosterCard } from '../../state';

const BoosterCardCol: React.FC<{ card: BoosterCard }> = ({ card }) => {
  const [imgUrlIndex, setImgUrlIndex] = useState(0);
  const imgUrlListLength = card.imgUrlList ? card.imgUrlList.length : 0;
  const incrementImgUrlIndex = () => {
    const indexNew = (imgUrlIndex + imgUrlListLength + 1) % imgUrlListLength;

    setImgUrlIndex(indexNew);
  };

  const imgUrl = card.imgUrlList ? card.imgUrlList[imgUrlIndex] : null;

  return (
    <Col>
      <Card style={{ width: '12rem', minHeight: '24rem' }}>
        {imgUrl ? <Card.Img variant="top" src={imgUrl} alt={card.cardName} /> : <></>}
        <Card.Body>
          <Card.Title>{card.cardName}</Card.Title>
          <Card.Text>
            {imgUrlListLength > 1 ? (
              <Button variant="link" onClick={incrementImgUrlIndex}>
                Reverse
              </Button>
            ) : (
              <></>
            )}
            {card.dataUrl ? (
              <Button variant="link" href={card.dataUrl} target="_blank">
                Card data
              </Button>
            ) : (
              <></>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BoosterCardCol;
