import { CashEquipment, Equipment } from './Equipment';
import { GeneralInformation } from './GeneralInformation';
import { Spec } from './Spec';
import { Symbol } from './Symbol';

export interface Character extends GeneralInformation {
    equipments: Equipment[];
    spec: Spec;
    arcanes: Symbol[];
    authentics: Symbol[];
    petEquipments: CashEquipment[];
    cashEquipments: CashEquipment[];
}