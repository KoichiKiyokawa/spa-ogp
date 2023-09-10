import { FC } from "react"
import { useParams } from "react-router-dom"
import "./App.css"

export const Component: FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <>
      <h1>Post {id} Page</h1>
      <div className="card">
        <p>
          Edit <code>src/PostDetail.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

Component.displayName = "PostDetail"
