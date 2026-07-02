"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, Check, ChevronLeft, Send, UserRound } from "lucide-react";
import { tweens } from "@/lib/material/motion";

const ASSET_ROOT = "/projects/caret/ui";

type CareState = "healthy" | "wilting";
type MemberId = "me" | "jennie" | "min" | "sumant" | "blake" | "lee";
type CareAction = "coffee" | "mail" | "help" | "coin";

type TeamMember = {
  id: MemberId;
  name: string;
  photo: string;
  state: CareState;
  self?: boolean;
};

const members: TeamMember[] = [
  { id: "me", name: "Me", photo: "Mephoto.png", state: "healthy", self: true },
  { id: "jennie", name: "Jennie", photo: "jenniephoto.png", state: "healthy" },
  { id: "min", name: "Min", photo: "Minphoto.png", state: "wilting" },
  { id: "sumant", name: "Sumant", photo: "sumantphoto.png", state: "healthy" },
  { id: "blake", name: "Blake", photo: "Blakephoto.png", state: "healthy" },
  { id: "lee", name: "Lee", photo: "Leephoto.png", state: "healthy" },
];

const careActions: Array<{ icon: string; id: CareAction; label: string }> = [
  { id: "coffee", label: "Coffee", icon: "coffee.png" },
  { id: "mail", label: "Message", icon: "mail.png" },
  { id: "help", label: "Help", icon: "help.png" },
  { id: "coin", label: "Coin", icon: "coin.png" },
];

const carrotState = {
  healthy: {
    background: "linear-gradient(135deg, #f7dcfb 0%, #fbe7fb 100%)",
    pattern: "backgroundhealthy.png",
    sticker: "healthybunny.png",
    status: "No problem so far! Everything is organized",
    tags: ["#Happy", "#Hehe"],
  },
  wilting: {
    background: "linear-gradient(135deg, #d8d8d8 0%, #c7c7c7 100%)",
    pattern: "backgroundsick.png",
    sticker: "sickbunny.png",
    status: "Today is a tough one, just coasting through",
    tags: ["#Busy", "#LittleTired"],
  },
} satisfies Record<
  CareState,
  {
    background: string;
    pattern: string;
    sticker: string;
    status: string;
    tags: [string, string];
  }
>;

function asset(name: string) {
  return `${ASSET_ROOT}/${name}`;
}

function CaretTile({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <article className={`project-ui-tile caret-ui-tile ${className}`} aria-label={label}>
      <div className="caret-ui-stage">{children}</div>
    </article>
  );
}

function CurrencyPill() {
  return (
    <div className="caret-currency-pill" aria-label="1,050 coins and 500 carrots">
      <span>
        <img src={asset("coincurrency.png")} alt="" />
        1,050
      </span>
      <span>
        <img src={asset("carrorcurrency.png")} alt="" />
        500
      </span>
    </div>
  );
}

function CaretTopBar({ unread = 4 }: { unread?: number }) {
  return (
    <header className="caret-topbar">
      <CurrencyPill />
      <span className="caret-topbar__spacer" />
      <button type="button" className="caret-circle-button micro-focus micro-pressable" aria-label="notifications">
        <Bell size={18} strokeWidth={2.1} />
        <em>{unread}</em>
      </button>
      <button type="button" className="caret-circle-button micro-focus micro-pressable" aria-label="profile">
        <UserRound size={19} strokeWidth={2.1} />
      </button>
    </header>
  );
}

function CaretPhone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`caret-phone ${className}`}>
      <span className="caret-phone__island" aria-hidden="true" />
      {children}
      <span className="caret-phone__home" aria-hidden="true" />
    </div>
  );
}

function MemberCard({
  active,
  member,
  onSelect,
}: {
  active: boolean;
  member: TeamMember;
  onSelect: () => void;
}) {
  const config = carrotState[member.state];

  return (
    <button
      type="button"
      className="caret-member-card micro-focus micro-pressable"
      data-active={active ? "true" : undefined}
      data-state={member.state}
      onClick={onSelect}
      style={{
        "--caret-card-bg": config.background,
        "--caret-card-pattern": `url("${asset(config.pattern)}")`,
      } as CSSProperties}
    >
      <span className="caret-member-card__name">{member.name}</span>
      <img className="caret-member-card__sticker" src={asset(config.sticker)} alt="" draggable={false} />
      <span className="caret-avatar">
        {member.self ? <UserRound size={13} /> : <img src={asset(member.photo)} alt="" draggable={false} />}
      </span>
    </button>
  );
}

function TeamScene({
  careSent,
  selectedId,
  onSelect,
}: {
  careSent: boolean;
  selectedId: MemberId;
  onSelect: (id: MemberId) => void;
}) {
  const visibleMembers = useMemo(
    () =>
      members.map((member) =>
        member.id === "min" && careSent
          ? { ...member, state: "healthy" as const }
          : member,
      ),
    [careSent],
  );

  return (
    <CaretPhone className="caret-phone--team">
      <CaretTopBar unread={careSent ? 3 : 4} />
      <main className="caret-team-scene" aria-label="Caret team wellbeing interface">
        <h3>Our Team</h3>
        <div className="caret-team-grid">
          {visibleMembers.map((member) => (
            <MemberCard
              key={member.id}
              active={selectedId === member.id}
              member={member}
              onSelect={() => onSelect(member.id)}
            />
          ))}
        </div>
      </main>
      <img className="caret-grass" src={asset("grassbottom2.png")} alt="" draggable={false} />
    </CaretPhone>
  );
}

function DetailCard({
  careSent,
  member,
}: {
  careSent: boolean;
  member: TeamMember;
}) {
  const displayState = member.id === "min" && careSent ? "healthy" : member.state;
  const config = carrotState[displayState];

  return (
    <section
      className="caret-detail-card"
      data-state={displayState}
      style={{
        "--caret-card-bg": config.background,
        "--caret-card-pattern": `url("${asset(config.pattern)}")`,
      } as CSSProperties}
      aria-label={`${member.name} care card`}
    >
      <span className="caret-detail-card__name">{member.name}</span>
      <h3>{displayState === "healthy" && member.id === "min" ? "Feeling better already" : config.status}</h3>
      <span className="caret-detail-tag caret-detail-tag--left">{config.tags[0]}</span>
      <span className="caret-detail-tag caret-detail-tag--right">{config.tags[1]}</span>
      <img className="caret-detail-card__sticker" src={asset(config.sticker)} alt="" draggable={false} />
      <span className="caret-avatar caret-avatar--large">
        <img src={asset(member.photo)} alt="" draggable={false} />
      </span>
    </section>
  );
}

function DetailScene({
  careSent,
  member,
}: {
  careSent: boolean;
  member: TeamMember;
}) {
  return (
    <CaretPhone className="caret-phone--detail">
      <CaretTopBar unread={careSent ? 3 : 4} />
      <main className="caret-detail-scene" aria-label="Caret teammate care interface">
        <button type="button" className="caret-back-button micro-focus micro-pressable" aria-label="back to team">
          <ChevronLeft size={25} strokeWidth={2.2} />
        </button>
        <div className="caret-carousel-track">
          <span className="caret-carousel-peek" aria-hidden="true" />
          <DetailCard careSent={careSent} member={member} />
          <span className="caret-carousel-peek caret-carousel-peek--right" aria-hidden="true" />
        </div>
      </main>
      <button type="button" className="caret-send-button micro-focus micro-pressable">
        Send
        <span aria-hidden="true">🥕</span>
      </button>
    </CaretPhone>
  );
}

function CareActionScene({
  careSent,
  selectedAction,
  selectedMember,
  onSelectAction,
  onSend,
}: {
  careSent: boolean;
  selectedAction: CareAction;
  selectedMember: TeamMember;
  onSelectAction: (action: CareAction) => void;
  onSend: () => void;
}) {
  return (
    <div className="caret-overlay-scene" aria-label="Caret send care interface">
      <div className="caret-overlay-phone">
        <h3>
          Send your carings to
          <br />
          {selectedMember.name}!
        </h3>
        <div className="caret-action-grid">
          {careActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="caret-action-button micro-focus micro-pressable"
              data-active={selectedAction === action.id ? "true" : undefined}
              onClick={() => onSelectAction(action.id)}
            >
              <span>
                <img src={asset(action.icon)} alt="" draggable={false} />
              </span>
              {action.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="caret-overlay-send micro-focus micro-pressable"
          data-sent={careSent ? "true" : undefined}
          onClick={onSend}
        >
          {careSent ? (
            <>
              <Check size={18} />
              Sent
            </>
          ) : (
            <>
              <Send size={18} />
              Send
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function NotificationScene({
  careSent,
  selectedAction,
  selectedMember,
}: {
  careSent: boolean;
  selectedAction: CareAction;
  selectedMember: TeamMember;
}) {
  const action = careActions.find((item) => item.id === selectedAction) ?? careActions[0];

  return (
    <div className="caret-notification-scene" aria-label="Caret notification interface">
      <CurrencyPill />
      <AnimatePresence mode="wait">
        <motion.div
          key={careSent ? "sent" : "idle"}
          className="caret-notification-card"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={tweens.fast}
        >
          <span className="caret-avatar">
            <img src={asset(selectedMember.photo)} alt="" draggable={false} />
          </span>
          <span>
            <strong>{careSent ? selectedMember.name : "Jennie"}</strong>
            <em>{careSent ? `Received your ${action.label.toLowerCase()}` : "Sent you 1,000 coins!"}</em>
          </span>
          <img src={asset(action.icon)} alt="" draggable={false} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function CaretInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<MemberId>("min");
  const [selectedAction, setSelectedAction] = useState<CareAction>("coffee");
  const [careSent, setCareSent] = useState(false);
  const selectedMember = members.find((member) => member.id === selectedId) ?? members[2];

  function selectMember(id: MemberId) {
    setSelectedId(id);
    setCareSent(false);
  }

  function selectAction(action: CareAction) {
    setSelectedAction(action);
    setCareSent(false);
  }

  return (
    <motion.section
      className="project-ui-artifact caret-artifact"
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      aria-label="Caret interface board"
    >
      <div className="project-ui-board project-ui-board--caret">
        <CaretTile className="caret-ui-tile--team" label="Caret team board">
          <TeamScene careSent={careSent} selectedId={selectedId} onSelect={selectMember} />
        </CaretTile>
        <CaretTile className="caret-ui-tile--detail" label="Caret teammate detail board">
          <DetailScene careSent={careSent} member={selectedMember} />
        </CaretTile>
        <CaretTile className="caret-ui-tile--actions" label="Caret care action board">
          <CareActionScene
            careSent={careSent}
            selectedAction={selectedAction}
            selectedMember={selectedMember}
            onSelectAction={selectAction}
            onSend={() => setCareSent(true)}
          />
        </CaretTile>
        <CaretTile className="caret-ui-tile--notification" label="Caret notification board">
          <NotificationScene
            careSent={careSent}
            selectedAction={selectedAction}
            selectedMember={selectedMember}
          />
        </CaretTile>
      </div>
    </motion.section>
  );
}
