import {FC} from "react";
import {Modal} from "antd";

interface Props{
  isVisible: boolean;
}

export const EmbedBuilder: FC<Props> = ({isVisible}) => {
  return(
    <Modal title="Basic Modal" visible={isVisible} onOk={() => {}} onCancel={()  => {}}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  )
}