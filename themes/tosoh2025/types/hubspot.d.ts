import type { ThemeColor } from "./global";

export interface HubSpotMenu {
  activeBranch: boolean | null;
  activeNode: boolean | null;
  blogNode: boolean | null;
  categoryId: number | null;
  children: HubSpotMenu[] | null;
  contentGroupId: number | null;
  contentType: string | null;
  errorMessage: string | null;
  guid: string | null;
  isDeleted: boolean | null;
  isNonLinkingNode: boolean | null;
  isPublished: boolean | null;
  label: string | null;
  level: number | null;
  linkTarget: string | null;
  live: boolean | null;
  nodeType: number | null;
  pageId: number | null;
  pageTitle: string | null;
  parentGuid: string | null;
  slug: string | null;
  state: string | null;
  subcategory: string | null;
  topLevelAncestorGuid: string | null;
  url: string | null;
  urlParamStr: string | null;
  urlWithoutAnchor: string | null;
}
