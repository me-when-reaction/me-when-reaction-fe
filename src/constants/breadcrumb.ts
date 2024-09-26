import { BsHouse } from "react-icons/bs";

// type MENU = "insert-image" | "get-image" | "home"

type MENU = {
  INSERT_IMAGE: "insert-image",
  UPDATE_IMAGE: "update-image",
  HOME: "home",
  FAQ: "faq"
}

export const MENU_LINK = {
  "/image/update": "UPDATE_IMAGE",
  "/image/insert": "INSERT_IMAGE",
  "/": "HOME",
  "/faq": "FAQ"
} satisfies Record<string, keyof MENU>

export interface BreadcrumbLiteNav {
  title: string;
  link?: keyof typeof MENU_LINK;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const NAV_MENU = {
  INSERT_IMAGE: [
    {
      title: "Home",
      icon: BsHouse,
      link: '/'
    },
    {
      title: 'Insert Image'
    }
  ],
  UPDATE_IMAGE: [
    {
      title: "Home",
      icon: BsHouse,
      link: '/'
    },
    {
      title: 'Update Image'
    }
  ],
  HOME: [
    {
      title: "Home",
      icon: BsHouse
    }
  ],
  FAQ: [
    {
      title: "Home",
      icon: BsHouse,
      link: '/'
    },
    {
      title: 'FAQ'
    }
  ]
} satisfies Record<keyof MENU, BreadcrumbLiteNav[]>