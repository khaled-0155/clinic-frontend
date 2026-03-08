import { useQuery } from "@tanstack/react-query";
import { Button, Input, List, Card } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import patientsService from "../../services/patients.service";

const { TextArea } = Input;

const PatientNotes = ({ patientId }) => {
  const { t } = useTranslation();

  const [note, setNote] = useState("");

  const { data, refetch } = useQuery({
    queryKey: ["patientNotes", patientId],
    queryFn: () => patientsService.getNotes(patientId),
  });

  const addNote = async () => {
    if (!note) return;

    await patientsService.addNote(patientId, { text: note });

    setNote("");
    refetch();
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <TextArea
          rows={3}
          placeholder={t("add_note")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button type="primary" style={{ marginTop: 8 }} onClick={addNote}>
          {t("save")}
        </Button>
      </Card>

      <List
        dataSource={data || []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.createdBy?.name}
              description={item.text}
            />
            <div>{new Date(item.createdAt).toLocaleDateString()}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PatientNotes;
