import { Group, Box, Divider, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export default function InfoProfile({
  statistics,
}: {
  statistics: { label: string; value: number; link?: string }[];
}) {
  const navigate = useNavigate();

  return (
    <Group justify="center" mt="lg" style={{ gap: "clamp(8px, 3vw, 24px)" }}>
      {statistics.map((stat, index) => (
        <Fragment key={stat.label}>
          <Box
            onClick={() => stat.link && navigate(stat.link)}
            style={{
              cursor: stat.link ? "pointer" : "default",
              flex: 1,
              minWidth: 0,
              textAlign: "center",
            }}
          >
            <Text fz="24px" c="primary" fw={700} ta="center">
              {stat.value}
            </Text>
            <Text c="dimmed">{stat.label}</Text>
          </Box>
          {index < statistics.length - 1 ? (
            <Divider orientation="vertical" />
          ) : null}
        </Fragment>
      ))}
    </Group>
  );
}
