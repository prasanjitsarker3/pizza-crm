import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
  active?: boolean;
}

interface UIState {
  breadcrumbs: BreadcrumbItem[];
}

const initialState: UIState = {
  breadcrumbs: [{ label: "Dashboard", href: "/admin" }],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<UIState["breadcrumbs"]>) => {
      const hasDashboard = action.payload.some(
        (crumb) => crumb.label === "Dashboard"
      );

      if (!hasDashboard && action.payload.length > 0) {
        state.breadcrumbs = [
          { label: "Dashboard", href: "/admin" },
          ...action.payload,
        ];
      } else {
        state.breadcrumbs = action.payload;
      }
    },
    addBreadcrumb: (
      state,
      action: PayloadAction<UIState["breadcrumbs"][0] & { parent?: string }>
    ) => {
      const { parent, ...breadcrumb } = action.payload;
      if (parent) {
        const parentIndex = state.breadcrumbs.findIndex(
          (crumb) => crumb.label === parent
        );

        if (parentIndex !== -1) {
          state.breadcrumbs = state.breadcrumbs.slice(0, parentIndex + 1);
          state.breadcrumbs = state.breadcrumbs.map((crumb) => ({
            ...crumb,
            active: false,
          }));
          state.breadcrumbs.push({
            ...breadcrumb,
            active: true,
          });
        }
      } else {
        const exists = state.breadcrumbs.some(
          (crumb) => crumb.label === breadcrumb.label
        );

        if (!exists) {
          state.breadcrumbs = state.breadcrumbs.map((crumb) => ({
            ...crumb,
            active: false,
          }));

          state.breadcrumbs.push({
            ...breadcrumb,
            active: true,
          });
        }
      }
    },
    resetBreadcrumbs: (state) => {
      state.breadcrumbs = [{ label: "Dashboard", href: "/admin" }];
    },
  },
});

export const { setBreadcrumbs, addBreadcrumb, resetBreadcrumbs } =
  breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;
