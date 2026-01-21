"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Add a new navigation group
type AddGroupInput = {
  title: string;
  section: string;
};

export async function addGroup({ title, section }: AddGroupInput) {
  const maxOrder = await prisma.linkGroup.aggregate({
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? 0) + 1;
  const group = await prisma.linkGroup.create({
    data: { title, section: section as any, order },
  });
  revalidatePath("/admin/settings/nav");
  return group;
}

// Edit a navigation group
type EditGroupInput = {
  id: string;
  title: string;
  section: string;
};

export async function editGroup({ id, title, section }: EditGroupInput) {
  const group = await prisma.linkGroup.update({
    where: { id },
    data: { title, section: section as any },
  });
  revalidatePath("/admin/settings/nav");
  return group;
}

// Delete a navigation group (and its links)
export async function deleteGroup(id: string) {
  await prisma.linkGroup.delete({ where: { id } });
  revalidatePath("/admin/settings/nav");
}

// Reorder navigation groups
type ReorderGroupsInput = {
  ids: string[]; // new order of group ids
};

export async function reorderGroups({ ids }: ReorderGroupsInput) {
  await Promise.all(
    ids.map((id, idx) =>
      prisma.linkGroup.update({ where: { id }, data: { order: idx + 1 } })
    )
  );
  revalidatePath("/admin/settings/nav");
}

// Add a new link to a group
type AddLinkInput = {
  groupId: string;
  label: string;
  url: string;
};

export async function addLink({ groupId, label, url }: AddLinkInput) {
  const maxOrder = await prisma.navLink.aggregate({
    where: { groupId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? 0) + 1;
  const link = await prisma.navLink.create({
    data: { groupId, label, url, order },
  });
  revalidatePath("/admin/settings/nav");
  return link;
}

// Edit a link
type EditLinkInput = {
  id: string;
  label: string;
  url: string;
};

export async function editLink({ id, label, url }: EditLinkInput) {
  const link = await prisma.navLink.update({
    where: { id },
    data: { label, url },
  });
  revalidatePath("/admin/settings/nav");
  return link;
}

// Delete a link
export async function deleteLink(id: string) {
  await prisma.navLink.delete({ where: { id } });
  revalidatePath("/admin/settings/nav");
}

// Reorder links within a group
type ReorderLinksInput = {
  groupId: string;
  ids: string[]; // new order of link ids
};

export async function reorderLinks({ groupId, ids }: ReorderLinksInput) {
  await Promise.all(
    ids.map((id, idx) =>
      prisma.navLink.update({ where: { id }, data: { order: idx + 1 } })
    )
  );
  revalidatePath("/admin/settings/nav");
}
