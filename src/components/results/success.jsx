import React from "react";
import { Button, Result } from "antd";

export default function Success() {
  return (
    <div>
      <Result
        status="success"
        title="Your operation has been executed"
        extra={
          <Button type="primary" key="console">
            Go Console
          </Button>
        }
      />
    </div>
  );
}
