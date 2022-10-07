import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";

export default function BasicDateTimePicker({ value, onChange, labelText }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label={labelText}
          value={value}
          onChange={onChange}
        />
      </LocalizationProvider>
    </>
  );
}
