import { FC } from "react";
import { Helmet } from "react-helmet-async";
import "./App.css";
import {useParams} from 'react-router-dom'

export const Component: FC = () => {
  const {id} = useParams<{ id: string }>();


  return (
    <>
      <Helmet>
        <title>Post {id}</title>
        <meta name="og:description" content={`Post ${id} Page`} />
      </Helmet>

      <h1>Post {id} Page</h1>
      <div className="card">
        <p>
          Edit <code>src/PostDetail.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
};

Component.displayName = "PostDetail";
