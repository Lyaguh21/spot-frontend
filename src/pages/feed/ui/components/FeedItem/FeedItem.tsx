import { IFeedItem } from "@/entities/feed";
import { IMapMarker } from "@/entities/map";
import { SpotSkeletonLoader } from "@/shared/ui";
import VisitCard from "@/widgets/visit-card";
import ViewVisitInfoDrawer from "@/widgets/visit-info-drawer";
import { useState } from "react";
import styles from "./FeedItem.module.css";

export default function FeedItem({ item }: { item: IFeedItem }) {
  const [selectedDetailsVisit, setSelectedDetailsVisit] =
    useState<IMapMarker | null>(null);
  const isCouple = item.ownerType === "COUPLE" && Boolean(item.couple);
  const owners = isCouple
    ? (item.couple?.members.map(({ user }) => user) ?? [])
    : item.user
      ? [item.user]
      : [];
  const ownerName = isCouple
    ? item.couple?.generatedName ||
      owners.map(({ name, username }) => name || username).join(" и ")
    : item.user?.name || item.user?.username || "Пользователь";

  const openDetails = () => {
    setSelectedDetailsVisit({
      ...item,
      authors: owners,
      author: owners[0],
      description: item.description ?? "",
      address: item.place.address ?? item.place.title,
      lat: item.place.lat,
      lng: item.place.lng,
    });
  };

  return (
    <>
      <VisitCard
        visit={item}
        owners={owners}
        ownerName={ownerName}
        onAction={openDetails}
      />

      <ViewVisitInfoDrawer
        selectedPlace={null}
        selectedVisit={selectedDetailsVisit}
        handleCloseVisitDrawer={() => setSelectedDetailsVisit(null)}
        setSelectedVisit={setSelectedDetailsVisit}
        allowCreate={false}
        participants={owners}
      />
    </>
  );
}

export function FeedItemSkeleton() {
  return (
    <SpotSkeletonLoader radius={20} className={styles.skeleton}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.skeletonLines}>
          <div />
          <div />
          <div />
        </div>
      </div>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonCopy}>
          <div />
          <div />
          <div />
        </div>
        <div className={styles.skeletonPhoto} />
      </div>
      <div className={styles.skeletonFooter} />
    </SpotSkeletonLoader>
  );
}
