import { SVGProps } from "react"

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="101"
      height="201"
      viewBox="0 0 101 201"
      fill={props.fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M0.667228 100.036C0.667228 155.265 45.4386 200.036 100.667 200.036V150.036C73.0528 150.036 50.6671 127.651 50.6671 100.036H0.667228Z" />
      <path d="M50.6671 50.0366H100.667V100.036H50.6671L50.6671 50.0366Z" />
      <path d="M0.667001 0.0369289H50.6669L50.6671 50.0366L0.667017 50.0368L0.667001 0.0369289Z" />
    </svg>
  )
}
