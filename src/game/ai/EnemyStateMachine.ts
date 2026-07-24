export type EnemyAiState = 'Approach' | 'Position' | 'Telegraph' | 'Attack' | 'Recover';
export class EnemyStateMachine { state: EnemyAiState='Approach'; transition(next: EnemyAiState): void { this.state=next; } }
