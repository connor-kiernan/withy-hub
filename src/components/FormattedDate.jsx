const FormattedDate = ({instant}) => {
  const date = new Date(instant);
  let dateOptions = {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };

  return date.toLocaleString('en-GB', dateOptions);
}

export default FormattedDate;