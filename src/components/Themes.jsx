import { useContext, useState, useEffect } from "react"
import { ThemeContext } from "./ThemeContext"


function Themes(props) {
  const { children, title } = props;
  const [theme, setTheme] = useState('dark');
  const [bg, setBg] = useState('#000');

  useEffect(() => {
    const bodys = document.querySelector('body');
    bodys.style.backgroundColor = bg;
  }, [bg]);
  

  const ClickOn = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    theme === "dark" ? setBg("#fff") : setBg("#000")
  }
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Button onClick={ClickOn}></Button>
        <Panel title={title}>{children}</Panel>
      </ThemeContext.Provider>
    </>
  );
}

const Panel = (props) => {
  const { title, children, thm } = props
  const theme = useContext(ThemeContext)
  const className = thm ? (thm + " " + theme) : (theme)
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  );
}

const Button = (props) => {
  const { onClick, children } = props;
  const theme = useContext(ThemeContext)
  const className = "button-" + theme + " " + theme
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
export default Themes