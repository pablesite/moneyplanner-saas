"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guidePhases = void 0;
exports.findGuidePhaseById = findGuidePhaseById;
exports.getActiveGuidePhase = getActiveGuidePhase;
exports.guidePhases = [
    {
        id: 1,
        title: 'Deuda',
        focus: 'Eliminar deuda mala y ordenar pasivos',
        objective: 'Reducir intereses altos y deuda no respaldada.',
        progress: 100,
    },
    {
        id: 2,
        title: 'Flujo de caja',
        focus: 'Consolidar superavit mensual estable',
        objective: 'Mantener ingresos por encima de gastos de forma consistente.',
        progress: 68,
    },
    {
        id: 3,
        title: 'Fondo de emergencia',
        focus: 'Construir colchon de seguridad',
        objective: 'Acumular liquidez para cubrir imprevistos y gastos esenciales.',
        progress: 35,
    },
    {
        id: 4,
        title: 'Salud patrimonial',
        focus: 'Balancear activos y pasivos',
        objective: 'Mejorar apalancamiento, respaldo de deuda, concentracion y liquidez.',
        progress: 18,
    },
    {
        id: 5,
        title: 'Independencia financiera',
        focus: 'Elevar activos productivos',
        objective: 'Construir ingresos de activos que cubran el estilo de vida.',
        progress: 6,
    },
];
function findGuidePhaseById(id) {
    var _a;
    return (_a = exports.guidePhases.find(function (phase) { return phase.id === id; })) !== null && _a !== void 0 ? _a : null;
}
function getActiveGuidePhase() {
    var _a;
    return (_a = exports.guidePhases.find(function (phase) { return phase.progress < 100; })) !== null && _a !== void 0 ? _a : exports.guidePhases[exports.guidePhases.length - 1];
}
