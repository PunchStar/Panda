import React, { ReactNode } from "react"
import styled from "styled-components"

interface Props {
  children: ReactNode
}

export default function MainLayout(props: Props) {
  const { children } = props
  return (
    <div className="wrapper d-flex align-items-stretch">
      <MainLayoutWrapper className="flex-grow-1 mw-100 overflow-auto min-vh-100">
          <div className="content">{children}</div>
      </MainLayoutWrapper>
    </div>
  )
}
const MainLayoutWrapper = styled.div`
  margin: 0 auto 2rem!important;
  margin-top: 20px!important;
  max-width: 998px!important;
`