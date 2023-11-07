import React, { createContext, useMemo, useState, useContext } from "react";
// import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

// Додати тип Menu Selected
type SelectedMenu = {
  id: MenuIds;
};

type MenuSelected = {
  selectedMenu: SelectedMenu;
};

type MenuAction = {
  onSelectedMenu: (menu: SelectedMenu) => void;
};

const MenuSelectedContext = createContext<MenuSelected | undefined>(undefined);

// Додайте тип MenuAction

const MenuActionContext = createContext<MenuAction | undefined>(undefined);

type PropsProvider = {
  children: React.ReactNode; // Додати тип для children
};

function MenuProvider({ children }: PropsProvider) {
  // Додати тип для SelectedMenu він повинен містити { id }
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({
    id: "first",
  });

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Додайте вірний тип для меню
};

function MenuComponent({ menus }: PropsMenu) {
  const menuAction = useContext(MenuActionContext);
  const menuSelected = useContext(MenuSelectedContext);
  if (!menuAction || !menuSelected) {
    return null;
  }

  const { onSelectedMenu } = menuAction;
  const { selectedMenu } = menuSelected;

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
