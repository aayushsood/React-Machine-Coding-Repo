import useLocalStorage from "../CustomHooks/useLocalStorage";

const Theme: React.FC = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage<"light" | "dark">(
    "theme",
    "light",
  );

  return (
    <>
      <h1>This is theme {theme}</h1>
      <button
        onClick={() => {
          setTheme("dark");
        }}
      >
        Set theme to dark
      </button>
      <button
        onClick={() => {
          setTheme("light");
        }}
      >
        Reset Theme
      </button>

      <button onClick={removeTheme}>Remove theme</button>
    </>
  );
};

export default Theme;
