import React from "react";
import PageLayout from "./PageLayout";

export default function Profile(){
  return (
    <PageLayout path={["about me"]} >
      Hi, I'm Emma. More about me here...

      <br />
      <br />
      <a href="https://dandy-apricot-218.notion.site/961cb613e0b24ea287e145442cb79c35?v=4f6a4a05e95e41138787644b763d090b">A colleciton of my learning notes on Notion</a>
      <br />
      <a href="https://www.linkedin.com/in/emma-l-corbett/">My LinkedIn profile</a>
      <br />
      <a href="https://github.com/elcorbs">My Github profile</a>
    </PageLayout>
  )
}