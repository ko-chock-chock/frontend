import CommunityBoardDetail from "@/components/communityBoard/CommunityBoard-detail";
import React from "react";

const page = ({ params }: { params: { boardId: string } }) => {
  return <CommunityBoardDetail params={params} />;
};

export default page;
