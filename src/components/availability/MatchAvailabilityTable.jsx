import React from "react";
import {Table} from "react-bootstrap";
import {normaliseAvailability} from "./AvailabilityCard";
import {selectAllPlayers, useGetPlayersQuery} from "../../features/players/playerSlice";
import LoadingScreen from "../LoadingScreen";
import {useSelector} from "react-redux";

const availabilities = ["AVAILABLE", "IF_DESPERATE", "UNAVAILABLE", "FAN_CLUB"];

const MatchAvailabilityTable = ({playerAvailability}) => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPlayersQuery();

  const players = useSelector(selectAllPlayers);

  if (isLoading) {
    return <LoadingScreen/>;
  }

  if (isError) {
    return <p>Unknown error when fetching matches: {JSON.stringify(error)}</p>;
  }

  if (!isSuccess) {
    return <div></div>;
  }

  return (
      <Table bordered responsive>
        <caption className="caption-top">Team Availability</caption>
        <tbody>
        {players.map(player => ({
          group: player?.position?.positionGroup,
          playerName: `${player.firstName} ${player.lastName}`,
          availability: playerAvailability[player.sub]
        }))
        .sort(({group: groupA, availability: availabilityA}, {group: groupB, availability: availabilityB}) => {
          if (groupA === "STAFF") {
            return -1;
          }

          if (groupB === "STAFF") {
            return 1;
          }

          if (!availabilityA) {
            return 1;
          }

          if (!availabilityB) {
            return -1;
          }

          return availabilities.indexOf(availabilityA.status) - availabilities.indexOf(availabilityB.status);
        })
        .map(({playerName, availability}) => {
          const {text, variant} = normaliseAvailability(availability);
          return (
              <tr key={playerName}>
                <td className="align-middle">{playerName}</td>
                <td className={`table-${variant} text-capitalize align-middle`}>{text}</td>
              </tr>
          );
        })}
        </tbody>
      </Table>
  );
};

export default MatchAvailabilityTable;