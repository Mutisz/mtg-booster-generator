import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import { BoosterCard } from '../../state';

const baseImgUrl = 'https://gatherer.wizards.com/Handlers/Image.ashx';
const baseGathererUrl = 'https://gatherer.wizards.com/Pages/Card/Details.aspx';

const getImgUrlList = (card: BoosterCard): string[] =>
  card.multiverseIdList?.map((multiverseId) => `${baseImgUrl}?multiverseid=${multiverseId}&type=card`) ?? [];

const getGathererUrlList = (card: BoosterCard): string[] =>
  card.multiverseIdList?.map((multiverseId) => `${baseGathererUrl}?multiverseid=${multiverseId}`) ?? [];

const BoosterCardCol: React.FC<{ card: BoosterCard }> = ({ card }) => (
  <Col>
    <Card style={{ width: '12rem', minHeight: '24rem' }}>
      {getImgUrlList(card).map((url) => (
        <Card.Img key={url} variant="top" src={url} alt={card.cardName} />
      ))}
      <Card.Body>
        <Card.Title>{card.cardName}</Card.Title>
        {getGathererUrlList(card).map((url) => (
          <Card.Text key={url}>
            <a href={url} target="_blank">
              Show on Gatherer
            </a>
          </Card.Text>
        ))}
      </Card.Body>
    </Card>
  </Col>
);

export default BoosterCardCol;
