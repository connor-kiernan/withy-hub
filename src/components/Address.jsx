import React from "react";

const Address = ({address}) => {
  const addressComponents = [address["line1"], address["line2"], address["postcode"].toUpperCase()];

  return (
      <>
        {addressComponents.map(addressSection =>
          (<p key={`${addressSection}`} className="mb-0">{addressSection}</p>)
      )}
      </>
  );
};

export default Address;