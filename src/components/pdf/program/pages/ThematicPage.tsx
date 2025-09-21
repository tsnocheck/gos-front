import { Fragment, type FC } from 'react';
import { ProgramSection, programSection, type ProgramPDFProps, type Topic } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { calcWidth, PDFStyles } from '../../shared/utils';
import { PDFList, PDFTable } from '../../shared';
import { Text } from '@react-pdf/renderer';
import HTMLContent from '../../shared/ui/HTMLContent';

const TOTAL_COLS = 13;

export const ThematicPage: FC<ProgramPDFProps> = ({ program }) => {
  const modulesBySection = (section: ProgramSection) =>
    program.modules?.filter((m) => m.section === section) || [];

  const ModuleThematicTable: FC<{ topics: Topic[] }> = ({ topics }) => {
    const totals = (topics || []).reduce(
      (acc, t) => {
        const l = t.lecture?.hours || 0;
        const p = t.practice?.hours || 0;
        const d = t.distant?.hours || 0;
        acc.lecture += l;
        acc.practice += p;
        acc.distant += d;
        acc.total += l + p + d;
        return acc;
      },
      { lecture: 0, practice: 0, distant: 0, total: 0 },
    );

    return (
      <PDFTable.Self style={{ marginBottom: 30 }}>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>№ п/п</PDFTable.Th>
          <PDFTable.Th style={calcWidth(4 / TOTAL_COLS)}>Тема</PDFTable.Th>
          <PDFTable.Tr
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...calcWidth(6 / TOTAL_COLS),
            }}
          >
            <PDFTable.Th>Формы организации, часы</PDFTable.Th>
            <PDFTable.Tr>
              <PDFTable.Th style={calcWidth(2 / 3)}>Ауд. зан.</PDFTable.Th>
              <PDFTable.Th style={calcWidth(1 / 3)}>Сам. раб.</PDFTable.Th>
            </PDFTable.Tr>
            <PDFTable.Tr>
              <PDFTable.Td style={calcWidth(1 / 3)}>Лекц. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Практ. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Дист. обучение</PDFTable.Td>
            </PDFTable.Tr>
          </PDFTable.Tr>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}>Всего ч.</PDFTable.Th>
        </PDFTable.Tr>

        {(topics || []).map((topic, idx) => {
          const l = topic.lecture?.hours || 0;
          const p = topic.practice?.hours || 0;
          const d = topic.distant?.hours || 0;
          return (
            <PDFTable.Tr key={idx}>
              <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{idx + 1}.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(4 / TOTAL_COLS)}>{topic.name}</PDFTable.Td>
              <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{l || '-'}</PDFTable.Td>
              <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{p || '-'}</PDFTable.Td>
              <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{d || '-'}</PDFTable.Td>
              <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{l + p + d || '-'}</PDFTable.Td>
            </PDFTable.Tr>
          );
        })}

        <PDFTable.Tr>
          <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(5 / TOTAL_COLS) }}>
            ИТОГО:
          </PDFTable.Th>
          <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{totals.lecture || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{totals.practice || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{totals.distant || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{totals.total || '-'}</PDFTable.Td>
        </PDFTable.Tr>
      </PDFTable.Self>
    );
  };

  const DistantContentTable: FC<{ topics: Topic[] }> = ({ topics }) => {
    const totals = (topics || []).reduce((acc, t) => acc + (t.distant?.hours || 0), 0);

    return (
      <PDFTable.Self>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / 8)}>№ п/п</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / 8)}>Тема</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / 8)}>
            Содержание самостоятельной работы в режиме дистанционного обучения образовательного
            модуля
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / 8)}>Кол-во часов</PDFTable.Th>
        </PDFTable.Tr>

        {(topics || []).map((topic, idx) => (
          <PDFTable.Tr key={idx}>
            <PDFTable.Td style={calcWidth(1 / 8)}>{idx + 1}.</PDFTable.Td>
            <PDFTable.Td style={calcWidth(3 / 8)}>{topic.name}</PDFTable.Td>
            <PDFTable.Td style={calcWidth(3 / 8)}>
              <Text>
                1. Содержание самостоятельной работы в режиме дистанционного обучения: {'\n'}
              </Text>
              <PDFList items={topic.distant?.content || []} />
              <Text>
                2. Формы организации самостоятельной работы в режиме дистанционного обучения:{'\n'}
              </Text>
              <PDFList items={topic.distant?.forms || []} />
            </PDFTable.Td>
            <PDFTable.Td style={calcWidth(1 / 8)}>{topic.distant?.hours || '-'}</PDFTable.Td>
          </PDFTable.Tr>
        ))}

        <PDFTable.Tr>
          <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(7 / 8) }}>ВСЕГО:</PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / 8)}>{totals || '-'}</PDFTable.Td>
        </PDFTable.Tr>
      </PDFTable.Self>
    );
  };

  const PracticeContentTable: FC<{ topics: Topic[] }> = ({ topics }) => {
    const totals = (topics || []).reduce((acc, t) => acc + (t.practice?.hours || 0), 0);

    return (
      <PDFTable.Self>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / 8)}>№ п/п</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / 8)}>Тема</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / 8)}>
            Содержание практических занятий образовательного модуля
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / 8)}>Кол-во часов</PDFTable.Th>
        </PDFTable.Tr>

        {(topics || []).map((topic, idx) => (
          <PDFTable.Tr key={idx}>
            <PDFTable.Td style={calcWidth(1 / 8)}>{idx + 1}.</PDFTable.Td>
            <PDFTable.Td style={calcWidth(3 / 8)}>{topic.name}</PDFTable.Td>
            <PDFTable.Td style={calcWidth(3 / 8)}>
              <Text>1. Содержание практического занятия: {'\n'}</Text>
              <PDFList items={topic.practice?.content || []} />
              <Text>2. Формы организации практического занятия: {'\n'}</Text>
              <PDFList items={topic.practice?.forms || []} />
            </PDFTable.Td>
            <PDFTable.Td style={calcWidth(1 / 8)}>{topic.practice?.hours || '-'}</PDFTable.Td>
          </PDFTable.Tr>
        ))}

        <PDFTable.Tr>
          <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(7 / 8) }}>ВСЕГО:</PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / 8)}>{totals || '-'}</PDFTable.Td>
        </PDFTable.Tr>
      </PDFTable.Self>
    );
  };

  const LectureContentTable: FC<{ topics: Topic[] }> = ({ topics }) => {
    const totals = (topics || []).reduce((acc, t) => acc + (t.lecture?.hours || 0), 0);

    return (
      <PDFTable.Self>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / 8)}>№ п/п</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / 8)}>Тема</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / 8)}>
            Содержание лекционных занятий образовательного модуля
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / 8)}>Кол-во часов</PDFTable.Th>
        </PDFTable.Tr>

        {(topics || []).map((topic, idx) => (
          <PDFTable.Tr key={idx}>
            <PDFTable.Td style={calcWidth(1 / 8)}>{idx + 1}.</PDFTable.Td>
            <PDFTable.Td style={calcWidth(3 / 8)}>{topic.name}</PDFTable.Td>
            <PDFTable.Td style={calcWidth(3 / 8)}>
              <PDFList items={topic.lecture?.content || []} />
            </PDFTable.Td>
            <PDFTable.Td style={calcWidth(1 / 8)}>{topic.lecture?.hours || '-'}</PDFTable.Td>
          </PDFTable.Tr>
        ))}

        <PDFTable.Tr>
          <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(7 / 8) }}>ВСЕГО:</PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / 8)}>{totals || '-'}</PDFTable.Td>
        </PDFTable.Tr>
      </PDFTable.Self>
    );
  };

  const IntermediateAttestations: FC<{ moduleCode: string }> = ({ moduleCode }) => {
    const list = (program.attestations || []).filter((a) => a.moduleCode === moduleCode);
    if (!list.length) return null;
    return (
      <>
        {list.map((a, idx) => (
          <Fragment key={`att-${moduleCode}-${idx}`}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 8 }}>{a.name}</Text>
            {a.requirements && <Text style={{ marginTop: 2 }}>{a.requirements}</Text>}
            {a.attempts ? (
              <Text style={{ marginTop: 2 }}>Количество попыток на прохождение - {a.attempts}</Text>
            ) : null}
            {a.criteria && (
              <>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 6 }}>
                  Критерии оценивания
                </Text>
                <HTMLContent html={a.criteria} />
              </>
            )}
            {a.examples && (
              <>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 6 }}>
                  Пример задания
                </Text>
                <HTMLContent html={a.examples} />
              </>
            )}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <PDFPage title="Учебно-тематический план" ui={{ title: { marginBottom: 10 } }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', lineHeight: 1 }}>
        РАБОЧИЕ ПРОГРАММЫ{'\n'}
        <Text style={{ fontWeight: 'normal' }}>
          образовательных модулей дополнительной профессиональной программы повышения квалификации{' '}
          {'\n'}
        </Text>
        <Text style={PDFStyles.italic}>«{program.title ?? 'Название программы'}»</Text>
      </Text>

      {[ProgramSection.NPR, ProgramSection.PMR, ProgramSection.VR].map((section) => {
        const modules = modulesBySection(section);
        if (!modules.length) return null;
        return (
          <Fragment key={`section-${section}`}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: 30,
              }}
            >
              {programSection.full[section].toUpperCase()}
            </Text>

            {modules.map((m, idx) => (
              <Fragment key={`${section}-module-${idx}`}>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Рабочая программа образовательного модуля {'\n'}{' '}
                  <Text style={{ ...PDFStyles.italic, fontWeight: 'normal' }}>«{m.name}»</Text>
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Учебно-тематический план образовательного модуля {'\n'}{' '}
                  <Text style={{ ...PDFStyles.italic, fontWeight: 'normal' }}>«{m.name}»</Text>
                </Text>

                <ModuleThematicTable topics={m.topics || []} />

                {Boolean(
                  (m.topics || []).some(
                    (t) => (t.lecture?.hours || 0) > 0 || (t.lecture?.content?.length || 0) > 0,
                  ),
                ) && (
                  <Fragment>
                    <Text
                      style={{
                        marginTop: 6,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Содержание лекционных занятий образовательного модуля {'\n'}
                      <Text style={{ ...PDFStyles.italic, fontWeight: 'normal' }}>«{m.name}»</Text>
                    </Text>
                    <LectureContentTable topics={m.topics || []} />
                  </Fragment>
                )}

                {Boolean(
                  (m.topics || []).some(
                    (t) =>
                      (t.practice?.hours || 0) > 0 ||
                      (t.practice?.content?.length || 0) > 0 ||
                      (t.practice?.forms?.length || 0) > 0,
                  ),
                ) && (
                  <Fragment>
                    <Text
                      style={{
                        marginTop: 6,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Содержание практических занятий образовательного модуля {'\n'}
                      <Text style={{ ...PDFStyles.italic, fontWeight: 'normal' }}>«{m.name}»</Text>
                    </Text>
                    <PracticeContentTable topics={m.topics || []} />
                  </Fragment>
                )}

                {Boolean(
                  (m.topics || []).some(
                    (t) =>
                      (t.distant?.hours || 0) > 0 ||
                      (t.distant?.content?.length || 0) > 0 ||
                      (t.distant?.forms?.length || 0) > 0,
                  ),
                ) && (
                  <Fragment>
                    <Text
                      style={{
                        marginTop: 6,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Содержание самостоятельной работы в режиме дистанционного обучения
                      образовательного модуля{' '}
                      <Text style={{ ...PDFStyles.italic, fontWeight: 'normal' }}>«{m.name}»</Text>
                    </Text>
                    <DistantContentTable topics={m.topics || []} />
                  </Fragment>
                )}
                {/* Промежуточные аттестации для модуля */}
                <IntermediateAttestations moduleCode={`${section} ${m.code}`} />
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </PDFPage>
  );
};
