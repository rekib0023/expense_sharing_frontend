import { Switch } from "@headlessui/react";
import BasicDateTimePicker from "./DateTimepicker";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

const Input = ({
  handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
  inputType = null,
  dropdownList,
}) => {
  return (
    <div className="my-5">
      {inputType !== "toggle" && inputType !== "datetimepicker" && (
        <label htmlFor={labelFor} className="text-sm">
          {labelText}
        </label>
      )}
      {inputType === "dropdown" ? (
        <select
          onChange={handleChange}
          defaultValue=""
          value={value}
          name={name}
          id={id}
          className="border border-gray-300 rounded-lg block w-full p-2.5"
        >
          {dropdownList.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      ) : inputType === "toggle" ? (
        <Switch.Group>
          <div className="flex items-center">
            <Switch
              onChange={handleChange}
              checked={value}
              value={value}
              name={name}
              className={`${
                value ? "bg-blue-600 " : "bg-gray-400"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2  focus:ring-offset-2`}
            >
              <span
                className={`${
                  value ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <Switch.Label className="ml-4">{labelText}</Switch.Label>
          </div>
        </Switch.Group>
      ) : inputType === "datetimepicker" ? (
        <BasicDateTimePicker
          onChange={handleChange}
          value={value}
          labelText={labelText}
        />
      ) : inputType === "textarea" ? (
        <textarea
          onChange={handleChange}
          value={value}
          id={id}
          name={name}
          type={type}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={placeholder}
        />
      ) : (
        <input
          onChange={handleChange}
          value={value}
          id={id}
          name={name}
          type={type}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default Input;
