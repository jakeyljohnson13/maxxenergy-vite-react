// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Heading, FormControl, FormLabel, Input, Button, Avatar, HStack, VStack,
  Text, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, InputGroup, InputRightElement, IconButton
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [role,     setRole]     = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password modal state
  const [isPwOpen, setPwOpen] = useState(false);
  const onPwOpen  = () => setPwOpen(true);
  const onPwClose = () => setPwOpen(false);

  // Change password fields
  const [curPw, setCurPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [confPw,setConfPw]  = useState("");
  const [showCur, setShowCur]   = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [showConf,setShowConf]  = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("api/users/me")
      .then(res => {
        setUsername(res.data.username);
        setEmail(res.data.email || "");
        setRole(res.data.role || "");
      })
      .catch(err => {
        if (err?.response?.status === 401) navigate("/api/auth/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url); // preview only
  };

  const save = async () => {
    try {
      setSaving(true);
      await API.put("api/users/me", { email });
      toast({ title: "Profile updated", status: "success", duration: 2000, isClosable: true });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.response?.data || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSaving(false);
    }
  };

  const submitPasswordChange = async () => {
    if (!curPw || !newPw || !confPw) {
      toast({ title: "Please fill in all password fields", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    if (newPw.length < 8) {
      toast({ title: "New password must be at least 8 characters", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    if (newPw !== confPw) {
      toast({ title: "New passwords do not match", status: "warning", duration: 2500, isClosable: true });
      return;
    }

    try {
      setPwSaving(true);
      await API.put("api/users/me/password", { currentPassword: curPw, newPassword: newPw });
      toast({ title: "Password updated", status: "success", duration: 2500, isClosable: true });

      // close modal and reset fields
      setCurPw(""); setNewPw(""); setConfPw("");
      setShowCur(false); setShowNew(false); setShowConf(false);
      onPwClose();
    } catch (err) {
      toast({
        title: "Password update failed",
        description: err?.response?.data || "Please check your current password",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return <Box p={8}><Text>Loading...</Text></Box>;

  return (
    <Box maxW="lg" mx="auto" p={6}>
      <Heading mb={6}>User Profile</Heading>

      <HStack spacing={6} mb={6} align="center">
        <Avatar name={username} src={avatarPreview || undefined} size="xl" />
        <div>
          <input type="file" accept="image/*" onChange={onAvatarChange} />
          <Text fontSize="sm" color="gray.500">Image preview only (not uploaded yet)</Text>
        </div>
      </HStack>

      <VStack align="stretch" spacing={4}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input value={username} isDisabled />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Role</FormLabel>
          <Input value={role} isDisabled />
        </FormControl>

        {/* Masked password + Change button */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <HStack>
            <Input value="••••••••••" isDisabled />
            <Button onClick={onPwOpen} variant="outline" flexShrink={0} whiteSpace="nowrap">Change Password</Button>
          </HStack>
          
        </FormControl>

        <HStack>
          <Button colorScheme="teal" onClick={save} isLoading={saving}>Save changes</Button>
          <Button variant="ghost" onClick={()=>navigate("/")}>Back</Button>
        </HStack>
      </VStack>

      {/* Password Change Modal */}
      <Modal isOpen={isPwOpen} onClose={onPwClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <FormControl mb={4}>
              <FormLabel>Current password</FormLabel>
              <InputGroup>
                <Input
                  type={showCur ? "text" : "password"}
                  value={curPw}
                  onChange={(e)=>setCurPw(e.target.value)}
                  autoComplete="current-password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showCur ? "Hide password" : "Show password"}
                    icon={showCur ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    variant="ghost"
                    onClick={()=>setShowCur(s=>!s)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>New password</FormLabel>
              <InputGroup>
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e)=>setNewPw(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showNew ? "Hide password" : "Show password"}
                    icon={showNew ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    variant="ghost"
                    onClick={()=>setShowNew(s=>!s)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Confirm new password</FormLabel>
              <InputGroup>
                <Input
                  type={showConf ? "text" : "password"}
                  value={confPw}
                  onChange={(e)=>setConfPw(e.target.value)}
                  autoComplete="new-password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConf ? "Hide password" : "Show password"}
                    icon={showConf ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    variant="ghost"
                    onClick={()=>setShowConf(s=>!s)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPwClose}>Cancel</Button>
            <Button colorScheme="purple" onClick={submitPasswordChange} isLoading={pwSaving}>
              Update Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
