import React from "react";
import { BsHash, BsHouse, BsHouseFill, BsImageFill } from "react-icons/bs";

export type RouteNested = {
  type: 'nested',
  action: Route[]
}

export type RouteSingle = {
  type: 'single',
  action: string
}

export type Route = {
  name: string,
  icon?: React.ReactSVGElement | (() => React.ReactSVGElement) | React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
} & (RouteNested | RouteSingle)

export const ROUTES : Route[] = [
  {
    name: "Home",
    type: 'single',
    icon: () => (<BsHouseFill className="text-sm"/>),
    action: "/"
  },
  {
    name: "Images",
    type: 'nested',
    icon: () => (<BsImageFill className="text-sm"/>),
    action: [
      {
        name: "Insert Image",
        type: 'single',
        action: "/image/insert"
      }
    ]
  }
  // {
  //   name: "Tag",
  //   type: 'nested',
  //   icon: () => (<BsHash/>),
  //   action: [
  //     {
  //       name: "Manage Tags",
  //       type: 'single',
  //       action: "/tag"
  //     }
  //   ]
  // }
] 