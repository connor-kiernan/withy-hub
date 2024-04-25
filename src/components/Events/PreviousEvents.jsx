import React from "react";
import {useSelector} from "react-redux";
import {selectIncompleteMatches} from "../../features/matches/matchSlice";
import {Button, Stack, Table} from "react-bootstrap";
import {Link} from "react-router-dom";

const PreviousEvents = () => {
  const incompleteMatches = useSelector(selectIncompleteMatches);

  const formatDate = (dateString) => {
    const localeString = new Date(dateString).toLocaleString();
    return localeString.substring(0, localeString.lastIndexOf(":"));
  };

  if (incompleteMatches.length === 0) {
    return <p className="text-center mt-5">No incomplete games to Show</p>
  }

  return (
      <>
        <Table bordered responsive className="border-secondary">
          <tbody>
          {incompleteMatches.map(match =>
              <tr key={match.id}>
                <td className="align-middle">
                  <Stack>
                    <div className="fs-5">{match.opponent}</div>
                    <div className="text-secondary">{formatDate(match.kickOffDateTime)}</div>
                  </Stack>
                </td>
                <td className="align-middle text-center">
                  <div className="d-grid">
                    <Link to={match.id}>
                      <Button variant="success" className="fs-5">Complete</Button>
                    </Link>
                  </div>
                </td>
              </tr>
          )}
          </tbody>
        </Table>
      </>
  );
};

export default PreviousEvents;