export interface Cases {
  total: number
  recovered: number
  active: number
  critical: number
}
export interface Deaths {
  total: number
}
export interface Statistics{
  cases: Cases
  deaths: Deaths
  population: number
  day: string
  country: string

}

