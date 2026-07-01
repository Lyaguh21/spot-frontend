import {
  IMapMarker,
  IMapPlaceVisits,
  useDeleteVisitMutation,
} from "@/entities/map";
import { selectUser } from "@/entities/user";
import { selectView, setMapCreateMode } from "@/entities/view";
import { useAppDispatch, useAppSelector, useNotifications } from "@/shared/lib";
import {
  SpotActionIcon,
  SpotConfirmActionModal,
  SpotDrawer,
} from "@/shared/ui";
import { Menu } from "@mantine/core";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VisitEditPage } from "./components/VisitEditPage";
import { VisitSelectionPage } from "./components/VisitSelectionPage";
import { VisitViewPage } from "./components/VisitViewPage";
import { VisitRatingParticipant } from "./model/types";
import styles from "./ViewVisitInfoDrawer.module.css";

export type { VisitRatingParticipant } from "./model/types";

type VisitInfoDrawerPage = "selection" | "view" | "edit";

export default function ViewVisitInfoDrawer({
  selectedPlace,
  selectedVisit,
  handleCloseVisitDrawer,
  setSelectedVisit,
  onCreateVisit,
  onVisitDeleted,
  onVisitUpdated,
  allowCreate = true,
  participants = [],
}: {
  selectedPlace: IMapPlaceVisits | null;
  selectedVisit: IMapMarker | null;
  handleCloseVisitDrawer: () => void;
  setSelectedVisit: (visit: IMapMarker | null) => void;
  onCreateVisit?: (place: IMapPlaceVisits) => void;
  onVisitDeleted?: (visitId: string) => void;
  onVisitUpdated?: (visit: IMapMarker) => void;
  allowCreate?: boolean;
  participants?: VisitRatingParticipant[];
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotifications();
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);
  const [page, setPage] = useState<VisitInfoDrawerPage>(
    selectedVisit ? "view" : "selection",
  );
  const [deleteConfirmOpened, setDeleteConfirmOpened] = useState(false);
  const [deleteVisit, { isLoading: deleteIsLoading }] =
    useDeleteVisitMutation();
  const drawerOpened = Boolean(selectedPlace || selectedVisit);
  const visitCoordinates =
    selectedVisit?.lat !== undefined && selectedVisit.lng !== undefined
      ? { lat: selectedVisit.lat, lng: selectedVisit.lng }
      : selectedPlace?.place;
  const isCoupleMode = viewState.map.createMode === "couple";
  const canCreateVisit =
    allowCreate &&
    (viewState.map.createMode === "my" ||
      (isCoupleMode &&
        Boolean(user.coupleId) &&
        Boolean(
          selectedPlace?.visits.some(
            (visit) =>
              visit.ownerType === "COUPLE" &&
              (!visit.coupleId || visit.coupleId === String(user.coupleId)),
          ),
        )));
  const visitHasRatingFrom = (username?: string) =>
    Boolean(
      username &&
        selectedVisit?.ratings.some((rating) => rating.nickname === username),
    );
  const canManageSelectedVisit = Boolean(
    selectedVisit &&
      ((selectedVisit.ownerType === "USER" &&
        visitHasRatingFrom(user.username)) ||
        (selectedVisit.ownerType === "COUPLE" &&
          Boolean(user.coupleId) &&
          (selectedVisit.coupleId === String(user.coupleId) ||
            visitHasRatingFrom(user.username) ||
            visitHasRatingFrom(user.partner?.username)))),
  );
  // const canAddVisitFromSelectedPlace = Boolean(
  //   selectedPlace && canCreateVisit && onCreateVisit,
  // );

  useEffect(() => {
    if (!drawerOpened) {
      setPage("selection");
      setDeleteConfirmOpened(false);
      return;
    }

    setPage(selectedVisit ? "view" : "selection");
  }, [drawerOpened, selectedVisit?.id]);

  const handleSelectVisit = (visit: IMapMarker) => {
    setSelectedVisit(visit);
    setPage("view");
  };

  const handleCloseDrawer = () => {
    setDeleteConfirmOpened(false);
    setPage("selection");
    handleCloseVisitDrawer();
  };

  const handleShowVisitOnMap = () => {
    if (!visitCoordinates) {
      return;
    }

    if (selectedVisit?.author?.username === user.username) {
      dispatch(setMapCreateMode("my"));
    } else if (selectedVisit?.coupleId === user.coupleId) {
      dispatch(setMapCreateMode("couple"));
    } else {
      dispatch(setMapCreateMode("friends"));
    }
    console.log(selectedVisit, selectedPlace, user.username, user.coupleId);
    navigate("/map", {
      state: {
        focusVisit: visitCoordinates,
      },
    });
    handleCloseDrawer();
  };

  const handleAddVisit = () => {
    if (!selectedPlace || !canCreateVisit || !onCreateVisit) {
      return;
    }

    onCreateVisit(selectedPlace);
  };

  const handleConfirmDeleteVisit = async () => {
    if (!selectedVisit?.id) {
      return;
    }

    const visitId = selectedVisit.id;

    try {
      await deleteVisit({ visitId }).unwrap();
      showSuccess("Визит удалён");
      setDeleteConfirmOpened(false);
      onVisitDeleted?.(visitId);
      handleCloseVisitDrawer();
    } catch (error) {
      showError("Не удалось удалить визит");
    }
  };

  const handleVisitSaved = (visit: IMapMarker) => {
    setSelectedVisit(visit);
    onVisitUpdated?.(visit);
    setPage("view");
  };

  const createVisitButton =
    selectedPlace && canCreateVisit && onCreateVisit ? (
      <SpotActionIcon
        type="button"
        size={32}
        aria-label="Добавить новый визит в это место"
        title="Добавить новый визит"
        onClick={() => onCreateVisit(selectedPlace)}
      >
        <IconPlus size={22} />
      </SpotActionIcon>
    ) : null;

  const visitActionsMenu = canManageSelectedVisit ? (
    <Menu shadow="lg" width={220} position="bottom-end" withinPortal>
      <Menu.Target>
        <SpotActionIcon
          type="button"
          size={32}
          aria-label="Действия с визитом"
          title="Действия с визитом"
        >
          <IconDotsVertical size={20} />
        </SpotActionIcon>
      </Menu.Target>
      <Menu.Dropdown className={styles.menuDropdown}>
        <Menu.Item
          leftSection={<IconPlus size={18} />}
          onClick={handleAddVisit}
        >
          Добавить посещение
        </Menu.Item>
        <Menu.Item
          leftSection={<IconEdit size={18} />}
          onClick={() => setPage("edit")}
        >
          Редактировать
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={18} />}
          onClick={() => setDeleteConfirmOpened(true)}
          disabled={!selectedVisit?.id || deleteIsLoading}
        >
          Удалить
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : null;

  const editBackButton = selectedVisit ? (
    <SpotActionIcon
      type="button"
      size={32}
      aria-label="Вернуться к просмотру визита"
      title="Вернуться к просмотру"
      onClick={() => setPage("view")}
    >
      <IconArrowLeft size={20} />
    </SpotActionIcon>
  ) : null;
  const topRowChildren =
    page === "edit"
      ? editBackButton
      : selectedVisit
      ? visitActionsMenu
      : createVisitButton;

  return (
    <>
      <SpotDrawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        topRowChildren={topRowChildren}
      >
        {page === "selection" && selectedPlace && (
          <VisitSelectionPage
            selectedPlace={selectedPlace}
            onSelectVisit={handleSelectVisit}
          />
        )}

        {page === "view" && selectedVisit && (
          <VisitViewPage
            selectedPlace={selectedPlace}
            selectedVisit={selectedVisit}
            participants={participants}
            currentUser={user}
            isCoupleMode={isCoupleMode}
            visitCoordinates={visitCoordinates}
            onShowVisitOnMap={handleShowVisitOnMap}
          />
        )}

        {page === "edit" && selectedVisit && (
          <VisitEditPage
            selectedPlace={selectedPlace}
            visit={selectedVisit}
            participants={participants}
            isCoupleMode={isCoupleMode}
            onCancel={() => setPage("view")}
            onSaved={handleVisitSaved}
          />
        )}
      </SpotDrawer>
      <SpotConfirmActionModal
        opened={deleteConfirmOpened}
        onClose={() => setDeleteConfirmOpened(false)}
        onConfirm={handleConfirmDeleteVisit}
        question="Удалить визит? Это действие нельзя отменить."
        confirmText="Удалить"
        confirmLoading={deleteIsLoading}
      />
    </>
  );
}
