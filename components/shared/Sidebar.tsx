"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { RootState } from "@/store";

export default function Sidebar() {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <div>
      <button onClick={() => dispatch(toggleSidebar())}>
        Toggle Sidebar
      </button>

      {open && <div>Sidebar Content</div>}
    </div>
  );
}
