import { FC } from "react"
import { Helmet } from "react-helmet-async"
import "./App.css"

export const Component: FC = () => {
  return (
    <>
      <Helmet>
        <title>About</title>
        <meta name="description" content="About Page" />
      </Helmet>
      <h1>About Page</h1>
      <div className="card">
        <p>
          Edit <code>src/About.tsx</code> and save to test HMR
        </p>
      </div>
      {[...Array(10000)].map((_, i) => (
        <div key={i}>hoge{i}</div>
      ))}
    </>
  )
}

Component.displayName = "About"
