"use client";

import { useEffect } from "react";

import { format } from "date-fns";

import { Divider } from "@mui/material";
import ConvMetaData from "@/types/ConvMetaData";
import useLayoutStore from "@/stores/LayoutStore";
import useConvListStore from "@/stores/ConvListStore";
import getConvMetaDataList from "@/actions/getConvMetaDataList";

import ConvItem from "./ConvItem";

export default function ConvList() {
  const convListStore = useConvListStore();
  const layoutStore = useLayoutStore();

  useEffect(() => {
    const updateConvListStore = async () => {
      const conversations = await getConvMetaDataList();
        // Group the conversations by date
      const groupedConvs: Record<string, ConvMetaData[]> = {};
      conversations.forEach((conv) => {
        const date = format(new Date(conv.lastModified), "yyyy-MM-dd");
        if (!groupedConvs[date]) {
          groupedConvs[date] = [];
        }
        groupedConvs[date].push({
          id: conv.id,
          title: conv.title,
          lastModified: conv.lastModified,
        });
      });

      convListStore.setGroupConvs(groupedConvs);
    };
    updateConvListStore();
  }, []);

  const groupedConvs = convListStore.groupedConvs;
  const displayStyle = layoutStore.navbarExpanded ? "" : "hidden";
  const isEmpty = !groupedConvs || (groupedConvs && Object.keys(groupedConvs).length === 0);

  return (
    <div className={`h-[500px] flex flex-col w-inherit ${displayStyle}`}>
      {!isEmpty && <Divider />}
      <div className="overflow-x-hidden overflow-y-scroll">
        {groupedConvs &&
          Object.keys(groupedConvs).map((date) => (
            <div key={date}>
              <Divider
                variant="middle"
                sx={{
                  width: "inherit",
                  overflow: "hidden",
                  marginTop: 1,
                  marginBottom: 1,
                }}
              >
                <p className="text-xs opacity-50">
                  {format(new Date(date), "M/d/yyyy")}
                </p>
              </Divider>
              {groupedConvs[date].map((conv) => (
                <ConvItem key={conv.id} convId={conv.id} title={conv.title} />
              ))}
            </div>
          ))}
      </div>
      {!isEmpty && <Divider />}
    </div>
  );
}
