import useToggle from "../hooks/useToggle";

export default function FormExtra() {
  const [check, toggleCheck] = useToggle("persist", false);
  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          onChange={toggleCheck}
          checked={check}
          className="h-4 w-4 text-blue-900 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-900"
        >
          Remember me
        </label>
      </div>

      <div className="text-sm">
        <a
          href="#"
          className="font-medium text-blue-900 hover:text-indigo-500"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
}
