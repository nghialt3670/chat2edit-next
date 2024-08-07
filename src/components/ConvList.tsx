"use client";

import { format } from "date-fns";

import { Divider } from "@mui/material";

import ConvItem from "./ConvItem";
import { getGroupedConvs } from "@/actions/getGroupedConvs";
import { useEffect, useState } from "react";
import ConvMetaData from "@/types/ConvMetaData";
import useLayoutStore from "@/stores/LayoutStore";

export default function ConvList() {
  const [groupedConvs, setGroupConvs] =
    useState<Record<string, ConvMetaData[]>>();
  const layoutStore = useLayoutStore();

  useEffect(() => {
    const updateGroupedConvs = async () => {
      const groupedConvs = await getGroupedConvs();
      setGroupConvs(groupedConvs);
    };
    updateGroupedConvs();
  }, []);

  const displayStyle = layoutStore.navbarExpanded ? "" : "hidden";

  return (
    <div className={`h-[500px] flex flex-col w-inherit ${displayStyle}`}>
      <Divider />
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
      <Divider />
    </div>
  );
}
