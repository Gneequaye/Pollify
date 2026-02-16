/// <reference types="vite/client" />

declare module '@/pages/DashboardPage' {
  const DashboardPage: React.ComponentType
  export default DashboardPage
}

declare module '@/data/data.json' {
  const value: any[]
  export default value
}
