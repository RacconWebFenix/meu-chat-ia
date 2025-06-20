import React from "react";

import styles from "./LineInputs.module.scss";
import ChatLoading from "../../shared/ChatLoading/ChatLoading";
import { TypeOfBranchProps } from "./types";
import { isIndustrialFields } from "../EquivalenceForm/types";

// Verifica se os campos pertencem ao ramo industrial

export default function LineInputs({
  ramoTipo,
  setBranchFields,
  branchFields,
  disabled,
}: TypeOfBranchProps) {
  // Verifica se os campos pertencem ao ramo industrial
  // e retorna os campos específicos para esse ramo
  if (ramoTipo === "2" && isIndustrialFields(branchFields)) {
    return (
      <div className={styles.inputsIndustrial}>
        <div className={styles.inputsRow}>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Nome da Peça ou Componente"
              value={branchFields.nomePeca}
              onChange={(e) =>
                setBranchFields({ ...branchFields, nomePeca: e.target.value })
              }
              maxLength={40}
              disabled={disabled}
            />
            <div className={styles.counter}>
              {branchFields.nomePeca.length}/40
            </div>
          </div>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Referência da Marca ou Fabricante"
              value={branchFields.referenciaInd}
              onChange={(e) =>
                setBranchFields({
                  ...branchFields,
                  referenciaInd: e.target.value,
                })
              }
              maxLength={40}
              disabled={disabled}
            />
            <div className={styles.counter}>
              {branchFields.referenciaInd.length}/40
            </div>
          </div>
        </div>
        <div className={styles.inputsRow}>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Norma Aplicável"
              value={branchFields.norma}
              onChange={(e) =>
                setBranchFields({ ...branchFields, norma: e.target.value })
              }
              maxLength={60}
              disabled={disabled}
            />
            <div className={styles.counter}>{branchFields.norma.length}/60</div>
          </div>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Marca ou Fabricante"
              value={branchFields.marcaInd}
              onChange={(e) =>
                setBranchFields({ ...branchFields, marcaInd: e.target.value })
              }
              maxLength={100}
              disabled={disabled}
            />
            <div className={styles.counter}>
              {branchFields.marcaInd.length}/100
            </div>
          </div>
        </div>
        <div className={styles.inputWithCounter}>
          <input
            className={styles.inputField}
            placeholder="Características físicas"
            value={branchFields.caracteristicasInd}
            onChange={(e) =>
              setBranchFields({
                ...branchFields,
                caracteristicasInd: e.target.value,
              })
            }
            maxLength={255}
            disabled={disabled}
          />
          <div className={styles.counter}>
            {branchFields.caracteristicasInd.length}/255
          </div>
        </div>

        <div className={styles.inputWithCounter}>
          <input
            className={styles.inputField}
            placeholder="Aplicação"
            value={branchFields.aplicacao}
            onChange={(e) =>
              setBranchFields({ ...branchFields, aplicacao: e.target.value })
            }
            maxLength={255}
            disabled={disabled}
          />
          <div className={styles.counter}>
            {branchFields.aplicacao.length}/255
          </div>
        </div>
      </div>
    );
  }

  // Automotiva e outros ramos
  if ("nome" in branchFields) {
    return (
      <div className={styles.inputsAutomotiva}>
        <div className={styles.inputsRow}>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Nome"
              value={branchFields.nome}
              onChange={(e) =>
                setBranchFields({ ...branchFields, nome: e.target.value })
              }
              maxLength={40}
              disabled={disabled}
            />
            <div className={styles.counter}>{branchFields.nome.length}/40</div>
          </div>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Referência"
              value={branchFields.referencia}
              onChange={(e) =>
                setBranchFields({ ...branchFields, referencia: e.target.value })
              }
              maxLength={40}
              disabled={disabled}
            />
            <div className={styles.counter}>
              {branchFields.referencia.length}/40
            </div>
          </div>
          <div className={styles.inputWithCounter}>
            <input
              className={styles.inputField}
              placeholder="Marca/Fabricante"
              value={branchFields.marcaFabricante}
              onChange={(e) =>
                setBranchFields({
                  ...branchFields,
                  marcaFabricante: e.target.value,
                })
              }
              maxLength={100}
              disabled={disabled}
            />
            <div className={styles.counter}>
              {branchFields.marcaFabricante.length}/100
            </div>
          </div>
        </div>

        <div className={styles.inputWithCounter}>
          <input
            className={styles.inputField}
            placeholder="Características físicas"
            value={branchFields.caracteristicas}
            onChange={(e) =>
              setBranchFields({
                ...branchFields,
                caracteristicas: e.target.value,
              })
            }
            maxLength={255}
            disabled={disabled}
          />
          <div className={styles.counter}>
            {branchFields.caracteristicas.length}/255
          </div>
        </div>
      </div>
    );
  }

  return <ChatLoading />;
}
