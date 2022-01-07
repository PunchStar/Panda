import styled from 'styled-components';

interface PositionsWidgetProps {
}

function PositionsWidget(props: PositionsWidgetProps) {
  return (
    <PositionWidgetWraaper>
        <table>
          <thead>
            <tr>
              <th>Outcome</th>
              <th>Price: Avg | Cur.</th>
              <th>P/L: $ | %</th>
              <th>Value: Init. | Cur.</th>
              <th>Max. Payout</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        No Market Positions
    </PositionWidgetWraaper>
  );
}

const PositionWidgetWraaper = styled.div`
font-size: .9rem;
table{
  border-collapse: collapse;
  margin: 1.5rem 0;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  thead {
    background: #fff;
    border-bottom: 1px solid #dedede;
    border-top: 1px solid #dedede;
    margin: 0;
    padding: 0;
    th{
      margin: 0;
      padding: 0.5rem 1rem;
    }
  }
  }
`;
export default PositionsWidget;
